export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  const routes = {
    '/motion-detection-game': 'https://game85.pages.dev/',
    '/wedding-photos': 'https://wedding-photos.nekoi275.workers.dev/',
    '/jewelry-configurator': 'https://jewelry-configurator.nekoi275.workers.dev/'
  };
  
  const target = routes[path];
  if (target) {
    const response = await fetch(target + url.search);
    return new Response(response.body, response);
  }
  
  return context.next();
}