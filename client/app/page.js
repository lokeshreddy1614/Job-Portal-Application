"use client";

import { useRouter } from "next/navigation";
import "./styles/globals.css";
import getToken from "./utils/cookie";
import { useContext, useEffect, useState } from "react";
import DataContext from "./context/DataContext";

export default function Home() {

  const { setTokenValue } = useContext(DataContext)

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken()
      setTokenValue(token)
    };
    fetchToken();
  }, []);


  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-6">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          Join Our Team
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          We are a leading company in software development, committed to innovation, excellence, and a thriving workplace. Explore our job opportunities and be part of something great!
        </p>
      </div>

      <button
        onClick={() => router.push("/jobs")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        Explore Open Positions
      </button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        <div className="p-6 bg-gray-800 shadow-lg rounded-lg text-center hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold text-white">Great Culture</h3>
          <p className="text-gray-400 mt-2">
            We foster a collaborative and inclusive workplace where your ideas matter.
          </p>
        </div>

        <div className="p-6 bg-gray-800 shadow-lg rounded-lg text-center hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold text-white">Career Growth</h3>
          <p className="text-gray-400 mt-2">
            Get mentorship, training, and opportunities to advance in your career.
          </p>
        </div>

        <div className="p-6 bg-gray-800 shadow-lg rounded-lg text-center hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold text-white">Competitive Benefits</h3>
          <p className="text-gray-400 mt-2">
            Enjoy health insurance, wellness programs, remote work options, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
