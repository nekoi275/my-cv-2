export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  const projectPaths = ['/jewelry-configurator', '/wedding-photos', '/motion-detection-game'];
  
  const matchedProject = projectPaths.find(p => path.startsWith(p + '/') || path === p);
  
  if (matchedProject) {
    const targets = {
      '/jewelry-configurator': 'https://jewelry-configurator.nekoi275.workers.dev',
      '/wedding-photos': 'https://wedding-photos.nekoi275.workers.dev',
      '/motion-detection-game': 'https://game85.pages.dev'
    };
    
    const target = targets[matchedProject];
    const newPath = path.replace(matchedProject, '');
    const fullUrl = target + newPath + url.search;
    
    const response = await fetch(fullUrl);
    
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    return newResponse;
  }
  
  return context.next();
}