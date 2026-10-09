import { Outlet, useLocation } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Suspense, useEffect } from 'react';
import LoadingState from './LoadingState';

export default function Layout() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-zinc-900">
            <Header />
            <main className="flex-1 bg-zinc-900">
                <Suspense fallback={<LoadingState />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
