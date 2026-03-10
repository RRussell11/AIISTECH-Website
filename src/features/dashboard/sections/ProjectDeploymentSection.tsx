import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import {
  DashboardProject,
  ProjectProvisioningRun,
  ProjectSagaRollbackStep,
  ProjectSagaStep,
  ProjectStatusResponse,
} from '@/features/dashboard/types';

interface ProjectDeploymentSectionProps {
  userId?: string;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const ProjectDeploymentSection: React.FC<ProjectDeploymentSectionProps> = ({ userId }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [statusBySlug, setStatusBySlug] = useState<Record<string, ProjectStatusResponse>>({});
  const [expandedTimelineBySlug, setExpandedTimelineBySlug] = useState<Record<string, boolean>>({});

  const projectsQuery = useQuery({
    queryKey: ['dashboard', 'projects'],
    queryFn: dashboardService.getProjects,
    refetchInterval: (query) => {
      const projects = query.state.data as DashboardProject[] | undefined;
      if (!projects?.length) return false;
      const hasProvisioning = projects.some((project) => project.status === 'provisioning');
      return hasProvisioning ? 3000 : false;
    },
  });

  const createMutation = useMutation({
    mutationFn: dashboardService.createProject,
    onSuccess: () => {
      setName('');
      setSlug('');
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'projects'] });
    },
  });

  const deployMutation = useMutation({
    mutationFn: dashboardService.deployProject,
    onSuccess: (_result, deployedSlug) => {
      dashboardService
        .getProjectStatus(deployedSlug)
        .then((statusResult) => {
          setStatusBySlug((prev) => ({ ...prev, [deployedSlug]: statusResult }));
        })
        .catch(() => {
          // no-op: polling query will refresh shortly
        });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'projects'] });
    },
  });

  const undeployMutation = useMutation({
    mutationFn: dashboardService.undeployProject,
    onSuccess: (_result, targetSlug) => {
      dashboardService
        .getProjectStatus(targetSlug)
        .then((statusResult) => {
          setStatusBySlug((prev) => ({ ...prev, [targetSlug]: statusResult }));
        })
        .catch(() => {
          // no-op: polling query will refresh shortly
        });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'projects'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: dashboardService.getProjectStatus,
    onSuccess: (statusResult, targetSlug) => {
      setStatusBySlug((prev) => ({ ...prev, [targetSlug]: statusResult }));
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'projects'] });
    },
  });

  const sortedProjects = useMemo(() => {
    const items = projectsQuery.data ?? [];
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [projectsQuery.data]);

  const liveStatusQuery = useQuery({
    queryKey: ['dashboard', 'projects', 'status-map', sortedProjects.map((project) => project.slug).join(',')],
    enabled: sortedProjects.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        sortedProjects.map(async (project) => {
          const status = await dashboardService.getProjectStatus(project.slug);
          return [project.slug, status] as const;
        })
      );
      const map: Record<string, ProjectStatusResponse> = {};
      entries.forEach(([projectSlug, status]) => {
        map[projectSlug] = status;
      });
      return map;
    },
    refetchInterval: (query) => {
      const data = query.state.data as Record<string, ProjectStatusResponse> | undefined;
      if (!data) {
        return 5000;
      }

      const hasActiveRun = Object.values(data).some(
        (item) => item.provisioning.saga?.status === 'running' || item.provisioning.saga?.status === 'rolling_back'
      );

      return hasActiveRun ? 2500 : 7000;
    },
  });

  const onCreate = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedSlug = slug || slugify(name);
    if (!name.trim() || !normalizedSlug) return;
    createMutation.mutate({ name: name.trim(), slug: normalizedSlug });
  };

  const deployLabel = (status: DashboardProject['status']) => {
    if (status === 'undeployed') return 'Configure & Deploy';
    if (status === 'provisioning') return 'Deploying...';
    if (status === 'deployed') return 'Live';
    return 'Retry Deploy';
  };

  const getStepBadge = (status: ProjectStatusResponse | undefined) => {
    if (!status?.provisioning?.saga) {
      return { label: 'No active saga', className: 'bg-slate-700/60 text-slate-200 border-slate-600' };
    }

    const saga = status.provisioning.saga;

    if (saga.status === 'running') {
      return {
        label: `Pending: ${saga.currentStep || 'queued'}`,
        className: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
      };
    }

    if (saga.status === 'rolling_back') {
      return {
        label: `Rollback: ${saga.currentStep || 'in progress'}`,
        className: 'bg-orange-500/20 text-orange-200 border-orange-400/40',
      };
    }

    if (saga.status === 'failed') {
      const failedStep = saga.failedStep || saga.currentStep || 'unknown-step';
      return {
        label: `Failed at ${failedStep}`,
        className: 'bg-red-500/20 text-red-200 border-red-400/40',
      };
    }

    return {
      label: `Completed: ${saga.currentStep || 'done'}`,
      className: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    };
  };

  const getSagaDetail = (status: ProjectStatusResponse | undefined, saga: ProjectProvisioningRun | null) => {
    if (!status) {
      return null;
    }

    if (saga?.status === 'failed') {
      return saga.error || status.provisioning.error || 'Provisioning failed.';
    }

    if (saga?.status === 'rolling_back') {
      return saga.error || status.provisioning.error || 'Rollback in progress.';
    }

    if (saga?.status === 'running') {
      return `Current step: ${saga.currentStep || status.provisioning.currentStep || 'queued'}`;
    }

    return null;
  };

  const formatTimelineTime = (value?: string) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStepStyles = (state: ProjectSagaStep['state']) => {
    if (state === 'completed') return 'bg-emerald-500';
    if (state === 'running') return 'bg-amber-400 animate-pulse';
    if (state === 'rolling_back') return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getRollbackStyles = (state: ProjectSagaRollbackStep['state']) => {
    if (state === 'completed') return 'bg-emerald-500';
    return 'bg-red-400';
  };

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Project Deployment</h3>
      <p className="text-sm text-slate-400 mb-6">
        Create automation projects and deploy each one to its own subdomain.
      </p>

      <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          value={name}
          onChange={(event) => {
            const nextName = event.target.value;
            setName(nextName);
            if (!slug) {
              setSlug(slugify(nextName));
            }
          }}
          placeholder="Project name"
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2"
        />
        <input
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          placeholder="project-slug"
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !name.trim()}
          className="px-4 py-2 rounded-lg bg-aiistech-primary text-aiistech-dark font-semibold disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Project'}
        </button>
      </form>

      {projectsQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading projects...</p>
      ) : projectsQuery.isError ? (
        <p className="text-sm text-red-300">Failed to load projects.</p>
      ) : sortedProjects.length === 0 ? (
        <p className="text-sm text-slate-500">No projects yet.</p>
      ) : (
        <div className="space-y-3">
          {sortedProjects.map((project) => {
            const isOwner = userId && project.ownerId === userId;
            const isDeploying = project.status === 'provisioning';
            const liveStatus =
              statusBySlug[project.slug] ??
              (liveStatusQuery.data ? liveStatusQuery.data[project.slug] : undefined);
            const saga = liveStatus?.provisioning?.saga ?? null;
            const stepBadge = getStepBadge(liveStatus);
            const sagaDetail = getSagaDetail(liveStatus, saga);
            const hasTimelineData = Boolean((saga?.steps && saga.steps.length) || (saga?.rollbackSteps && saga.rollbackSteps.length));
            const isTimelineExpanded = Boolean(expandedTimelineBySlug[project.slug]);

            return (
              <div key={project.id} className="bg-slate-800/70 border border-slate-700 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{project.name}</p>
                    <p className="text-xs text-slate-400">{project.slug}.aiistech.com</p>
                    <p className="text-xs text-slate-500 mt-1">Status: {project.status}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs border rounded-md px-2 py-1 ${stepBadge.className}`}>
                        {stepBadge.label}
                      </span>
                    </div>
                    {sagaDetail ? <p className="text-xs text-slate-300 mt-2">{sagaDetail}</p> : null}
                    {hasTimelineData ? (
                      <button
                        onClick={() => {
                          setExpandedTimelineBySlug((prev) => ({
                            ...prev,
                            [project.slug]: !prev[project.slug],
                          }));
                        }}
                        className="mt-2 text-xs text-sky-300 hover:text-sky-200"
                      >
                        {isTimelineExpanded ? 'Hide timeline' : 'View timeline'}
                      </button>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    {project.status === 'deployed' && project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 text-sm rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      >
                        Live ↗
                      </a>
                    ) : null}

                    <button
                      onClick={() => statusMutation.mutate(project.slug)}
                      className="px-3 py-2 text-sm rounded-lg bg-slate-700 text-slate-200"
                      disabled={statusMutation.isPending || liveStatusQuery.isFetching}
                    >
                      Refresh Status
                    </button>

                    {isOwner ? (
                      <>
                        <button
                          onClick={() => deployMutation.mutate(project.slug)}
                          disabled={
                            deployMutation.isPending ||
                            undeployMutation.isPending ||
                            isDeploying ||
                            project.status === 'deployed'
                          }
                          className="px-3 py-2 text-sm rounded-lg bg-aiistech-primary text-aiistech-dark font-semibold disabled:opacity-50"
                        >
                          {deployLabel(project.status)}
                        </button>
                        <button
                          onClick={() => undeployMutation.mutate(project.slug)}
                          disabled={
                            undeployMutation.isPending ||
                            deployMutation.isPending ||
                            isDeploying ||
                            project.status !== 'deployed'
                          }
                          className="px-3 py-2 text-sm rounded-lg bg-rose-500/20 text-rose-200 border border-rose-400/30 disabled:opacity-50"
                        >
                          {undeployMutation.isPending ? 'Undeploying...' : 'Undeploy'}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500">Owner action required</span>
                    )}
                  </div>
                </div>

                {isTimelineExpanded && hasTimelineData ? (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs font-semibold tracking-wide text-slate-300 uppercase mb-2">
                      Saga Timeline
                    </p>

                    <div className="space-y-2">
                      {(saga?.steps ?? []).map((step) => (
                        <div key={`${project.slug}-${step.name}-${step.at}`} className="flex items-start gap-2 text-xs">
                          <span className={`mt-1 h-2 w-2 rounded-full ${getStepStyles(step.state)}`} />
                          <div className="flex-1">
                            <p className="text-slate-200">
                              {step.name}
                              <span className="text-slate-400"> ({step.state})</span>
                            </p>
                            <p className="text-slate-500">{formatTimelineTime(step.at)}</p>
                          </div>
                        </div>
                      ))}

                      {(saga?.rollbackSteps ?? []).map((step) => (
                        <div
                          key={`${project.slug}-rollback-${step.name}-${step.at}`}
                          className="flex items-start gap-2 text-xs"
                        >
                          <span className={`mt-1 h-2 w-2 rounded-full ${getRollbackStyles(step.state)}`} />
                          <div className="flex-1">
                            <p className="text-slate-200">
                              rollback/{step.name}
                              <span className="text-slate-400"> ({step.state})</span>
                            </p>
                            <p className="text-slate-500">{formatTimelineTime(step.at)}</p>
                            {step.error ? <p className="text-red-300">{step.error}</p> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
