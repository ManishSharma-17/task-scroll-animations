'use client';
import { SLIDER_DATA } from "@/utils/data";
import { useEffect, useRef } from "react";

import gsap from "gsap";

const COLUMN_COUNT = 9;
const TOTAL_ROWS = 10;

export default function Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const rowsRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
    const rowStartWidth = useRef<number>(125);
    const rowEndWidth = useRef<number>(500);

    useEffect(() => {
        const section = sectionRef.current;
        const rows = section?.querySelectorAll('.row');

        if (!section || !rows || rows.length === 0) return;

        rowsRef.current = rows as NodeListOf<HTMLDivElement>;

        const isMobile = window.innerWidth < 768;
        rowStartWidth.current = isMobile ? 250 : 125;
        rowEndWidth.current = isMobile ? 750 : 500;

        const firstRow = rows[0] as HTMLElement;
        firstRow.style.width = `${rowEndWidth.current}%`;
        const expendedRowHeight = firstRow.offsetHeight;
        firstRow.style.width = '';

        const sectionGap = parseFloat(getComputedStyle(section).gap) || 0;
        const sectionPadding = parseFloat(getComputedStyle(section).paddingTop) || 0;

        const expendedSectionHeight = expendedRowHeight * rows.length + sectionGap * (rows.length - 1) + sectionPadding * 2;

        section.style.height = `${expendedSectionHeight}px`;

        function onScrollUpdate() {
            const scrolly = window.scrollY;
            const viewportHeight = window.innerHeight;

            rows.forEach((row) => {
                const rect = row.getBoundingClientRect();
                const rowTop = rect.top + scrolly;
                const rowBottom = rowTop + rect.height;

                const scrollStart = rowTop - viewportHeight;
                const scrollEnd = rowBottom;

                let progress = (scrolly - scrollStart) / (scrollEnd - scrollStart);
                progress = Math.max(0, Math.min(1, progress));
                const width =
                    rowStartWidth.current +
                    (rowEndWidth.current - rowStartWidth.current) * progress;
                row.style.width = `${width}%`;
            });
        }

        gsap.ticker.add(onScrollUpdate);

        return () => {
            gsap.ticker.remove(onScrollUpdate);
        };
    }, []);

    const rowsData = [];
    let currentSlideIndex: number = 0;

    // Generate rows data by repeating the SLIDER_DATA until we fill all rows and columns
    for (let r = 0; r < TOTAL_ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLUMN_COUNT; c++) {
            row.push(SLIDER_DATA[currentSlideIndex % SLIDER_DATA.length]);
            currentSlideIndex++;
        }
        rowsData.push(row);
    }

    return (
        <section ref={sectionRef} className="flex items-center overflow-hidden gap-0.5 flex-col">
            {rowsData.map((row, index) => (
                <div key={index} ref={rowsRef} className="row flex gap-1 w-[125%]">
                    {row.map((item, i) => (
                        <div key={i} className="col flex-1 aspect-7/5">
                            <img src={item.image} alt={item.name} className="h-full object-cover w-full" />
                        </div>
                    ))}
                </div>
            ))}
        </section>
    );
}
