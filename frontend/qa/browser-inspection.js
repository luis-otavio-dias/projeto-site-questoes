export async function inspect() {
  const completed = JSON.parse(localStorage.getItem('questio:study:v1:991')).simulations.find(s => s.status === 'COMPLETED');
  const paths = ['/', '/biblioteca', '/caderno/71', '/caderno/71/questao/101', '/caderno/71/revisar/101', '/banco', '/simulados', '/simulados/novo', `/resultado/${completed.id}`, '/desempenho', '/historico', '/importacoes', '/conta'];
  const results = [];
  for (const path of paths) {
    history.pushState({ usr: null, key: crypto.randomUUID(), idx: (history.state?.idx || 0) + 1 }, '', path);
    dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    await new Promise(resolve => setTimeout(resolve, 160));
    results.push({ path, width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, title: document.querySelector('h1')?.textContent || '', focusedMain: document.activeElement.id === 'main-content' });
  }
  return results;
}
