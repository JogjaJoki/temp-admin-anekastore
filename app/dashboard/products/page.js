"use client"

import { useUserToken } from "@/app/context/UserTokenContext";
import axios from "axios";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useTransition } from "react";
import Endpoint from "@/app/constant/constant";
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import {decode} from 'html-entities';

const PaginateLinks = ({ links, handleClick }) => {
    const getData = (url) => {
        // console.log(url)
    }
    return(
        <>
            <div  className="w-full text-md text-center text-gray-500 dark:text-gray-400 flex space-x-3 items-center justify-center p-4">
                {
                    links.map((l, index) => (
                        <button key={index} className="cursor-pointer" onClick={() => handleClick(l.url)}>{decode(l.label)}</button>
                    ))
                }
            </div>
        </>
    );
}

const TableItem = ( {product} ) => {

    const handleDelete = (id) => {  
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus produk ini?");
        if (confirmDelete) {
            setPending(true);  
            const postData = {
                id: id,
            };
            axios.post(Endpoint.BASE_URL + Endpoint.DELETEPRODUCT, postData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then((response) => {
                console.log('Response dari server:', response.data);
                startTransition(router.refresh);
                setPending(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    };

    const handleEdit = (id) => {
        router.replace(`/dashboard/products/${id}`);
    }

    return(
        <>
        {product && product.map((a) => (
            <tr key={a.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{a.id}</td>
                <td>{a.name}</td>
                <td>{a.category_name}</td>
                <td>
                    <img className="rounded w-28 p-3" src={`${Endpoint.PRODUCTIMAGE}${a.photo}`} />    
                </td>
                <td>{a.price}</td>
                <td>{a.weight}</td>
                <td>{a.stock}</td>
                <td>
                <button onClick={() => handleEdit(a.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <PencilIcon className="h-5 w-5" /> {/* Ikon Edit */}
                </button>
                <button onClick={() => handleDelete(a.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ms-2">
                    <TrashIcon className="h-5 w-5" /> {/* Ikon Delete */}
                </button>
                </td>
            </tr>
        ))}
        </>
    );
}

const Page = () => {
    const [ product, setProduct ] = useState([]);
    const { token, setToken } = useUserToken();
    const [isPending, setPending] = useState(false);
    const [isTransitionStarted, startTransition] = useTransition();
    const isMutating = isPending || isTransitionStarted;
    const router = useRouter();
    const [ links, setLinks ] = useState([]);
    // const pageCount = Math.ceil(items.length / itemsPerPage);

    useEffect(() => {
        axios.get(Endpoint.BASE_URL + Endpoint.PRODUCT, { 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log(response);
                setProduct(response.data.product.data);
                setLinks(response.data.product.links);
            })
            .catch((error) => {
                console.error('Gagal melakukan permintaan:', error);
            });
    }, [isPending])

    const handleClick = (url) => {
        if(url === null){
            return;
        }
        axios.get(url, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log(response);
            setProduct(response.data.product.data);
            setLinks(response.data.product.links);
        })
        .catch((error) => {
            console.error('Gagal melakukan permintaan:', error);
        });
    };
    return(
        <>
            <div className="grid justify-items-stretch mb-3">
                <Link href={`/dashboard/products/add`} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded justify-self-end">ADD</Link>
            </div>            
            <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Nama</th>
                        <th scope="col" className="px-6 py-3">Kategori</th>
                        <th scope="col" className="px-6 py-3">Photo</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Weight</th>
                        <th scope="col" className="px-6 py-3">Stock</th>
                        <th scope="col" className="px-6 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {isMutating ? <tr><td>{'Get Data'}</td></tr> : 
                    <TableItem product={product} />
                    }
                </tbody>
            </table>
            <PaginateLinks links={links} handleClick={handleClick}/>
        </>
    )
}

export default Page