import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './Header.module.scss';

const Header = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const favorites = useSelector((state: RootState) => state.favorites.favorites);

    const navItems = [
        { href: '/', label: 'Поиск', icon: '🔍' },
        { href: '/favorites', label: 'Избранное', icon: '❤️', badge: favorites.length },
        { href: '/history', label: 'История', icon: '📚' }
    ];

    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        🎬 MovieSearch
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.navDesktop}>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${router.pathname === item.href ? styles.active : ''}`}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                {item.label}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={styles.badge}>{item.badge}</span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={styles.menuButton}
                        aria-label="Открыть меню"
                        onClick={() => setIsMenuOpen((open) => !open)}
                    >
                        <span className={styles.menuIcon}>{isMenuOpen ? '✖️' : '☰'}</span>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className={styles.navMobile}>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${router.pathname === item.href ? styles.active : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                {item.label}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={styles.badge}>{item.badge}</span>
                                )}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;