import React from "react";
import { InertiaLink, usePage } from "@inertiajs/react";

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    categories: Category[];
}

const Index: React.FC<Props> = () => {
    const { props } = usePage<Props>();
    const { categories } = props;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <InertiaLink
                href="/categories/create"
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
            >
                Create New Category
            </InertiaLink>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Created At</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(category.created_at).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <InertiaLink
                                    href={`/categories/${category.id}/edit`}
                                    className="text-blue-500 mr-2"
                                >
                                    Edit
                                </InertiaLink>
                                <InertiaLink
                                    href={`/categories/${category.id}`}
                                    method="delete"
                                    as="button"
                                    className="text-red-500"
                                >
                                    Delete
                                </InertiaLink>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Index;