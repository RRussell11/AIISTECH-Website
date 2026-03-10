const fs   = require('fs');
const path = require('path');

module.exports = function add(domain, options) {
  const configPath = path.resolve(process.cwd(), 'multiplic.json');
  const config     = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const key    = options.path ? `${domain}${options.path}` : domain;
  const folder = options.path
    ? `sites/${domain}--${options.path.replace('/', '')}`
    : `sites/${domain}`;

  if (config.sites[key]) {
    console.error(`Site "${key}" already exists in multiplic.json`);
    process.exit(1);
  }

  config.sites[key] = { root: folder, framework: options.framework };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // Scaffold site folder from template
  const siteDir = path.resolve(process.cwd(), folder);
  fs.mkdirSync(path.join(siteDir, 'src'), { recursive: true });

  const tmpl = options.framework === 'angular'
    ? angularPackageJson(domain)
    : reactPackageJson(domain);

  fs.writeFileSync(path.join(siteDir, 'package.json'), JSON.stringify(tmpl, null, 2));

  console.log(`✓ Added ${key} → ${folder}`);
  console.log(`  Next: cd ${folder} && npm install && npm run dev`);
};

function reactPackageJson(name) {
  return {
    name: name.replace(/[^a-z0-9-]/g, '-'),
    version: '0.1.0',
    private: true,
    scripts: {
      dev:   'vite',
      build: 'vite build --outDir dist',
      preview: 'vite preview'
    },
    dependencies:    { react: '^18.3.1', 'react-dom': '^18.3.1' },
    devDependencies: { vite: '^5.0.0', '@vitejs/plugin-react': '^4.0.0' }
  };
}

function angularPackageJson(name) {
  return {
    name: name.replace(/[^a-z0-9-]/g, '-'),
    version: '0.1.0',
    private: true,
    scripts: {
      dev:   'ng serve',
      build: 'ng build --output-path dist',
      test:  'ng test'
    },
    dependencies:    { '@angular/core': '^17.0.0', '@angular/platform-browser': '^17.0.0' },
    devDependencies: { '@angular/cli': '^17.0.0' }
  };
}
