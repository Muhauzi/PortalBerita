import React from 'react';
import HomeLayout from '@/layouts/home-layout';

interface mainCategory {
    id: number;
    name: string;
}

interface subCategory {
    id: number;
    name: string;
    id_main_categories: number;
}

interface Props {
    mainCategories: mainCategory[];
    subCategories: subCategory[];
}


const Show: React.FC<Props> = ({ mainCategories, subCategories }) => {
    const navItems = mainCategories.map((category) => ({
        name: category.name,
        subcategories: subCategories
            .filter((sub) => sub.id_main_categories === category.id)
            .map((sub) => ({
                name: sub.name,
                href: `/category/${category.id}/${sub.id}`,
            })),
        href: `/category/${category.id}`,
    }));

    return (
        <HomeLayout navItems={navItems}>
            {/* Your page content goes here */}
            <h1>Welcome to the Home Page</h1>
        </HomeLayout>
    );
};

export default Show;