import React, { useState, useEffect, useRef } from 'react';

import TaskItem from './TaskItem';



/*

 * TaskList – Infinite carousel (wheel / trackpad scroll)

 *

 * 3-copy layout:  [ copy1 | copy2 | copy3 ]

 * Valid range:    (-2hw, 0]   where hw = one copy's pixel width

 * Wrap:  value > 0    → subtract hw  (scrolled past right boundary)

 *        value ≤ -2hw → add hw       (scrolled past left boundary)

 *

 * onLoadMore fires when the user scrolls near EITHER boundary, so

 * scrolling in both directions gradually reveals more tasks.

 */



const CARD_WIDTH = 320; // card 300px + gap 20px

const LOAD_THRESHOLD = 640; // 2 cards from either edge → trigger next page fetch



const TaskList = ({ tasks, onToggle, onDelete, onEdit, onLoadMore, hasMore }) => {

    const containerRef = useRef(null);

    const [containerWidth, setContainerWidth] = useState(0);

    const [offset, setOffset] = useState(0);



    // Keep a ref so the wheel handler always reads the latest hw & offset

    const hwRef = useRef(0);

    const prevHwRef = useRef(0); // hw from the previous render (for offset remapping)



    // ── Measure container width ───────────────────────────────────

    useEffect(() => {

        const measure = () => {

            if (containerRef.current)

                setContainerWidth(containerRef.current.offsetWidth);

        };

        measure();

        window.addEventListener('resize', measure);

        return () => window.removeEventListener('resize', measure);

    }, []);



    // ── Remap offset when tasks are appended ──────────────────────

    // When new tasks load, hw grows.  Without adjustment the same offset

    // pixel now points to a different task.  Fix: keep the same position

    // within one copy (which contains tasks at the same absolute pixels).

    useEffect(() => {

        const newHw = tasks.length * CARD_WIDTH;

        const oldHw = prevHwRef.current;



        if (oldHw > 0 && oldHw !== newHw) {

            setOffset(prev => {

                // Where were we within one copy of the OLD layout?

                const posInCopy = ((-prev) % oldHw + oldHw) % oldHw;

                // Place us at that same pixel in the NEW layout

                return wrap(-posInCopy, newHw);

            });

        }

        prevHwRef.current = newHw;

    }, [tasks.length]);



    // ── Wheel / trackpad scrolling ────────────────────────────────

    useEffect(() => {

        const el = containerRef.current;

        if (!el) return;



        const onWheel = (e) => {

            e.preventDefault();

            const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;

            const hw = hwRef.current;



            setOffset(prev => {

                const next = wrap(prev - delta, hw);



                // Load more tasks when the user scrolls near either boundary

                if (hasMore) {

                    const nearRightEdge = next > -LOAD_THRESHOLD;

                    const nearLeftEdge = next < -(2 * hw - LOAD_THRESHOLD);

                    if (nearRightEdge || nearLeftEdge) onLoadMore?.();

                }



                return next;

            });

        };



        el.addEventListener('wheel', onWheel, { passive: false });

        return () => el.removeEventListener('wheel', onWheel);

    }, [hasMore, onLoadMore]);



    // ── Render ────────────────────────────────────────────────────

    if (!tasks || tasks.length === 0) {

        return <p className="empty-msg">No tasks found. Add one above!</p>;

    }



    const visibleCount = Math.floor(containerWidth / CARD_WIDTH);

    const hw = tasks.length * CARD_WIDTH;

    hwRef.current = hw;



    // All tasks fit on screen – no scrolling needed

    if (visibleCount >= tasks.length && visibleCount > 0) {

        return (

            <div className="carousel-wrapper" ref={containerRef}>

                <div className="carousel-static">

                    {tasks.map(task => (

                        <div className="carousel-card" key={task.id}>

                            <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />

                        </div>

                    ))}

                </div>

            </div>

        );

    }



    // Three copies so scrolling in either direction is always seamless

    const loopedTasks = [...tasks, ...tasks, ...tasks];



    return (

        <div className="carousel-wrapper" ref={containerRef}>

            <div

                className="carousel-track"

                style={{ transform: `translateX(${offset}px)` }}

            >

                {loopedTasks.map((task, i) => (

                    <div className="carousel-card" key={`${task.id}-${i}`}>

                        <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />

                    </div>

                ))}

            </div>

        </div>

    );

};



// Keep value inside (-2hw, 0] for a seamless 3-copy infinite loop

function wrap(value, hw) {

    while (value > 0) value -= hw;

    while (value <= -2 * hw) value += hw;

    return value;

}



export default TaskList;