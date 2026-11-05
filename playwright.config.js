const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'tests',workers:1,timeout:45000,
 use:{actionTimeout:10000,navigationTimeout:20000,channel:'chrome',baseURL:'http://127.0.0.1:4335/cubejs-dashboard/',viewport:{width:1440,height:1000}},
 webServer:{command:process.env.PLAYWRIGHT_DEV?'npm start -- --port 4335 --strictPort':'npm run preview -- --port 4335 --strictPort',url:'http://127.0.0.1:4335/cubejs-dashboard/'}
});
