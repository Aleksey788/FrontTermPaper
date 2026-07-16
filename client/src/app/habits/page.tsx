"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import style from './page.module.css'

interface Habit {
    id: number;
    name: string;
    slug: string;
}

export default function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() =>
    {
        const loadHabits = async () => {
            try 
            {
                const response = await axios.get("https://localhost:7239/habits/");

                console.log(response.data);
                setHabits(response.data);
                
            } 
            catch (error) 
            {
                console.error(error);
            }
        };

        loadHabits();
    }, 
    []);

    return (
        <div>
            <h1>Список привычек</h1>
{habits.map((habit) => {
    const slug = habit.slug
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
        <Link key={habit.id} href={`/habits/${slug}`} className={style.habitLink}>
            {habit.name}
        </Link>
    );})}
        </div>
    );
}