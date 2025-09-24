
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChatIcon, TimelineIcon, LogIcon, ItemIcon, ForestIcon } from './icons/Icons';
import { useAppContext } from '../context/AppContext';

const Navigation: React.FC = () => {
    const { collectedItems, hasConsentedToForest, openForestConsentModal } = useAppContext();
    const [hasNewItems, setHasNewItems] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Effect to reset seen items if all items are gone
    useEffect(() => {
        if (collectedItems.length === 0) {
            sessionStorage.removeItem('seenItems');
            setHasNewItems(false);
        }
    }, [collectedItems.length]);

    // Effect to check for new items
    useEffect(() => {
        const seenItems = JSON.parse(sessionStorage.getItem('seenItems') || '[]');
        const hasUnseen = collectedItems.some(item => !seenItems.includes(item.id));
        setHasNewItems(hasUnseen);
    }, [collectedItems]);
    
    // Effect to mark items as seen when navigating to the item page
    useEffect(() => {
        if (location.pathname === '/item') {
            const allItemIds = collectedItems.map(item => item.id);
            sessionStorage.setItem('seenItems', JSON.stringify(allItemIds));
            setHasNewItems(false);
        }
    }, [location.pathname, collectedItems]);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${
            isActive ? 'text-sky-600' : 'text-gray-500 hover:text-sky-500'
        }`;

    const handleForestClick = (e: React.MouseEvent) => {
        // If consent is not yet determined (null) or explicitly denied (false), show modal
        if (hasConsentedToForest === null || hasConsentedToForest === false) {
            e.preventDefault();
            openForestConsentModal();
        } else {
            navigate('/forest');
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-sky-200 h-16 shadow-lg z-10">
            <div className="flex justify-around h-full">
                <NavLink to="/" className={navLinkClass}>
                    <ChatIcon />
                    <span className="text-xs mt-1">チャット</span>
                </NavLink>
                <NavLink to="/timeline" className={navLinkClass}>
                    <TimelineIcon />
                    <span className="text-xs mt-1">タイムライン</span>
                </NavLink>
                 <NavLink to="/forest" className={navLinkClass} onClick={handleForestClick}>
                    <ForestIcon />
                    <span className="text-xs mt-1">森</span>
                </NavLink>
                <NavLink to="/log" className={navLinkClass}>
                    <LogIcon />
                    <span className="text-xs mt-1">日記</span>
                </NavLink>
                <NavLink to="/item" className={navLinkClass}>
                    <div className="relative">
                        <ItemIcon />
                        {hasNewItems && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        )}
                    </div>
                    <span className="text-xs mt-1">オソナエモノ</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default Navigation;