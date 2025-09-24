
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Item, ItemType } from '../types';
import { JunkIcon, CouponIcon, HintIcon, AffiliateIcon } from '../components/icons/Icons';

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
    const getIcon = () => {
        switch (item.type) {
            case ItemType.Coupon: return <CouponIcon />;
            case ItemType.Hint: return <HintIcon />;
            case ItemType.Affiliate: return <AffiliateIcon />;
            case ItemType.Junk:
            default: return <JunkIcon />;
        }
    }
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-4">
                <div className="text-sky-500 flex-shrink-0">{getIcon()}</div>
                <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                </div>
            </div>
            {item.link && item.type === ItemType.Affiliate && (
                 <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-2 text-sm bg-amber-500 text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-amber-600 transition-colors w-full sm:w-auto sm:self-end"
                  >
                    詳細を見てみる
                </a>
            )}
        </div>
    );
};

const ItemPage: React.FC = () => {
    const { collectedItems } = useAppContext();

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-sky-700">オソナエモノ</h2>
            {collectedItems.length > 0 ? (
                [...collectedItems].reverse().map(item => <ItemCard key={item.id} item={item} />)
            ) : (
                <div className="text-center text-gray-500 mt-8 p-6 bg-white rounded-lg shadow-sm">
                    <p>まだ何も見つかっていません。</p>
                    <p className="text-sm mt-2">鳥たちが、時々何かを置いていってくれるようです。</p>
                </div>
            )}
        </div>
    );
};

export default ItemPage;
