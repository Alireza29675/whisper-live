import ApiKeyManager from './ApiKeyManager';
import styles from './Sidebar.module.css';
import cx from 'classnames';

interface IProps {
  pages: IPageModule[];
  active: IPageModule | null;
}

function Sidebar({ pages, active }: IProps) {
  return (
    <aside className={styles.Sidebar}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Whisper Live</h1>
          <span className={styles.chip}>dev</span>
        </div>
      </header>
      <ApiKeyManager />
      <ul className={styles.pagesList}>
        {pages.map((page) => (
          <li key={page.metadata.route} className={cx(styles.item,
            {
              [styles.active]: active?.metadata.route === page.metadata.route
            }
          )}>
            <a className={styles.link} href={'#' + page.metadata.route}>{page.metadata.title}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
