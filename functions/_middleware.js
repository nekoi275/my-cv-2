export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  const targets = {
    '/jewelry-configurator': 'https://jewelry-configurator.nekoi275.workers.dev',
    '/wedding-photos': 'https://wedding-photos.nekoi275.workers.dev',
    '/motion-detection-game': 'https://game85.pages.dev'
  };
  
  let matchedProject = null;
  let target = null;
  
  for (const [projectPath, targetUrl] of Object.entries(targets)) {
    if (path.startsWith(projectPath + '/') || path === projectPath) {
      matchedProject = projectPath;
      target = targetUrl;
      break;
    }
  }
  
  if (target) {
    const relativePath = path.replace(matchedProject, '') || '/';
    const fullUrl = target + relativePath + url.search;
    
    const response = await fetch(fullUrl);
    
    if (response.headers.get('content-type')?.includes('text/html')) {
      const html = await response.text();
      const fixedHtml = html.replace(/href="\//g, `href="/${matchedProject}/`);
      const fixedHtml2 = fixedHtml.replace(/src="\//g, `src="/${matchedProject}/`);
      return new Response(fixedHtml2, {
        headers: response.headers
      });
    }
    
    return new Response(response.body, response);
  }
  
  return context.next();
}