const {test,expect}=require('@playwright/test');
test('Cube queries render charts and orders, and widget collapse API remains compatible',async({page})=>{
 const errors=[],missing=[],queries=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});
 page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4335/')&&r.status()>=400)missing.push(r.url())});
 await page.route('**/cubejs-api/v1/load**',async route=>{
  const request=route.request();
  if(request.method()==='OPTIONS'){await route.fulfill({headers:{'access-control-allow-origin':'*','access-control-allow-headers':'authorization,content-type'}});return;}
  const query=JSON.parse(new URL(request.url()).searchParams.get('query')||request.postDataJSON().query);
  queries.push(query);
  const dimension=query.timeDimensions[0].dimension,measure=query.measures?.[0];
  const data=Array.from({length:measure?.includes('completed')?7:30},(_,i)=>({
   [dimension]:'2026-10-'+String(i+1).padStart(2,'0'),
   ...(measure?{[measure]:100+i}:{'Orders.id':i+1,'ProductCategories.name':'Security fixture','LineItems.quantity':2,'LineItems.price':25,'Orders.status':'completed'})
  }));
  await route.fulfill({json:{queryType:'regularQuery',results:[{query,data,annotation:{measures:{},dimensions:{},timeDimensions:{}}}]},headers:{'access-control-allow-origin':'*'}});
 });
 await page.goto('./#/app/cubejs');
 await expect(page.getByRole('heading',{name:'React E-Commerce Dashboard built with Cube.js'})).toBeVisible();
 await expect(page.locator('.recharts-line-curve')).toHaveCount(4);
 await expect(page.locator('tbody tr')).toHaveCount(10);
 await expect(page.locator('tbody')).toContainText('Security fixture');
 expect(queries).toHaveLength(5);
 const widget=page.locator('section').filter({hasText:'Total Revenue'}).last();
 await widget.evaluate(el=>window.jQuery(el).widgster('collapse'));
 await expect(widget.locator('.widget-body')).not.toBeVisible();
 await widget.evaluate(el=>window.jQuery(el).widgster('expand'));
 await expect(widget.locator('.widget-body')).toBeVisible();
 await page.screenshot({path:'test-results/analytics.png',fullPage:true});
 expect(errors).toEqual([]);expect(missing).toEqual([]);
});
test('Cube connection errors remain visible',async({page})=>{
 await page.route('**/cubejs-api/v1/load**',async r=> {
  const headers={'access-control-allow-origin':'*','access-control-allow-headers':'authorization,content-type'};
  if(r.request().method()==='OPTIONS') await r.fulfill({headers});
  else await r.fulfill({status:400,json:{error:'Analytics fixture unavailable'},headers});
 });
 await page.goto('./#/app/cubejs');
 await expect(page.getByRole('alert').filter({hasText:'Analytics fixture unavailable'}).first()).toContainText('Analytics fixture unavailable');
});
test('existing demo login and logout keep their local session behavior',async({page})=>{
 await page.route('**/cubejs-api/v1/load**',r=>r.fulfill({status:400,json:{error:'Offline fixture'},headers:{'access-control-allow-origin':'*','access-control-allow-headers':'authorization,content-type'}}));
 await page.goto('./#/login');
 await page.getByPlaceholder('Username').fill('demo');
 await page.getByPlaceholder('Password',{exact:true}).fill('demo');
 await page.getByRole('button',{name:'Login',exact:true}).click();
 await expect(page.getByRole('heading',{name:'React E-Commerce Dashboard built with Cube.js'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('id_token'))).toBe('1');
 await page.locator('.la-cog').click();
 await page.getByRole('button',{name:/Log Out/}).click();
 expect(await page.evaluate(()=>localStorage.getItem('id_token'))).toBeNull();
});
