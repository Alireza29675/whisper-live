import { getPages } from '@/utils/dynamicLoader';
import styles from './App.module.css';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Intro from './Intro';

function App() {
  const [examplePages, setExamplePages] = useState<IPageModule[]>([]);
  const [activePage, setActivePage] = useState<IPageModule | null>(null);

  useEffect(() => {
    // Set active page based on window.location.hash
    const setActive = () => {
      const hash = window.location.hash;
      const page = examplePages.find(page => page.metadata.route === hash.slice(1));
      setActivePage(page || null);
    };
    setActive();
    window.addEventListener('hashchange', setActive);
    return () => window.removeEventListener('hashchange', setActive);
  }, [examplePages]);


  useEffect(() => {
    getPages().then((pages) => setExamplePages(pages));
  }, [])

  return (
    <div className={styles.App}>
      <Sidebar pages={examplePages} active={activePage} />
      <div className={styles.Content}>
        {activePage ? <activePage.component /> : <Intro />}
      </div>
    </div>
  );
}

export default App;
