import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface IContainer {
  children: ReactNode;
  tabTitle: string;
  containerClass: string;
}

const Container = ({ children, containerClass, tabTitle }: IContainer) => {
  return (
    <section className={containerClass}>
      <Helmet>
        <title>{tabTitle} | Litee.</title>
      </Helmet>

      {children}
    </section>
  );
};

export default Container;
