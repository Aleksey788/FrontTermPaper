"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Habit {
    id: number;
    name: string;
}

export default function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() =>
    {
        const loadHabits = async () => {
            try 
            {
                const response = await axios.get("https://localhost:7239/habits");

                console.log(response.data);
                setHabits(response.data);
                
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
            {habits.map(habit => (
                <div key={habit.id}>
                    {habit.name}
                </div>
            ))}
        </div>
    );
}