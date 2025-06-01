import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    name: string;
    mainCategoryId: number;
}

interface PageProps extends InertiaPageProps {
    mainCategories: Category[];
    subCategories: SubCategory[];
  }

const ListMainCat: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { mainCategories } = props;

    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null);

    const handleMainCategoryClick = (id: number) => {
        setSelectedMainCategoryId(id);
        window.location.href = `/category/sub/${id}`;
    };

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Explore Main Categories</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mainCategories.map((category) => (
                <div
                    key={category.id}
                    className={`p-6 border rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer ${
                    selectedMainCategoryId === category.id ? 'bg-indigo-600 text-white' : 'bg-gray-50'
                    }`}
                    onClick={() => handleMainCategoryClick(category.id)}
                >
                    <h2 className={`text-2xl font-bold mb-2 ${selectedMainCategoryId === category.id ? 'text-white' : ''}`}>{category.name}</h2>
                    <p className={`text-sm ${selectedMainCategoryId === category.id ? 'text-white' : 'text-gray-600'}`}>
                        Click to explore subcategories under {category.name} category.
                    </p>
                </div>
                ))}
            </div>
            </div>
        </AppLayout>
    );
};

export default ListMainCat;
