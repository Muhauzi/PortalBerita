import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface MainCategory {
    id: number;
    name: string;
    description: string;
}

interface SubCategory {
    id: number;
    id_main_categories: number;
    name: string;
    description: string;
}

interface Props {
    mainCategory: MainCategory;
    subCategory: SubCategory;
}

const Show: React.FC<Props> = ({ mainCategory, subCategory }) => {
    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl mt-10 bg-white p-10 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Category Details</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-1">Main Category Name</h2>
                        <p className="text-xl font-medium text-gray-900">{mainCategory.name}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-1">Main Category Description</h2>
                        <p className="text-gray-800 text-base leading-relaxed">
                            {mainCategory.description || <span className="text-gray-400 italic">No description provided.</span>}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-1">Subcategory Name</h2>
                        <p className="text-xl font-medium text-gray-900">{subCategory.name}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-1">Subcategory Description</h2>
                        <p className="text-gray-800 text-base leading-relaxed">
                            {subCategory.description || <span className="text-gray-400 italic">No description provided.</span>}
                        </p>
                    </div>
                </div>

                <div className="mt-10">
                    <Link
                        href={`/category/sub/${subCategory.id_main_categories}`}
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                    >
                        ← Back to List
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;
