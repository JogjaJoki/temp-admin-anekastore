'use client'
import { useState, useEffect, useTransition } from "react";
import axios from 'axios';
import Endpoint from '@/app/constant/constant';
import { useUserToken } from '@/app/context/UserTokenContext';
import generateOrderReport from "../components/generateOrderReport";

const Page = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { token, setToken } = useUserToken();

    const handleGenerateReport = (e) => {
        // Lakukan logika untuk generate laporan
        console.log('Menghasilkan laporan dari', startDate, 'hingga', endDate);
        e.preventDefault();
        const formData = new FormData();

        formData.append('start', startDate);
        formData.append('end', endDate);

        axios.post(Endpoint.BASE_URL + Endpoint.REPORT, formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then((response) => {
            // Tangani respons dari server di sini
            console.log('Response dari server:', response.data);
            generateOrderReport(response.data.orders, response.data.total_orders, response.data.total_sales);
        })
        .catch((error) => {
            // Tangani error jika request gagal
            console.error('Error:', error);
        });
    };
    return(
        <>
            <div className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md flex flex-col space-y-7">
                    <h2 className="text-xl font-semibold mb-4">Generate Laporan Penjualan</h2>
                    <div className="mb-4">
                        <label htmlFor="start-date" className="block text-gray-700 text-start">Tanggal Awal</label>
                        <input 
                            type="date" 
                            id="start-date" 
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="end-date" className="block text-gray-700 text-start">Tanggal Akhir</label>
                        <input 
                            type="date" 
                            id="end-date" 
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button 
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleGenerateReport}
                    >
                        Generate
                    </button>
                </div>
            </div>
        </>
    );
}

export default Page