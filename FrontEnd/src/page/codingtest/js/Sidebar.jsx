import React, { useEffect, useState, useRef } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const Sidebar = () => {
    const [problemsByLevel, setProblemsByLevel] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(''); // 선택된 레벨 상태
    const [selectedType, setSelectedType] = useState(''); // 선택된 유형 상태
    const [isFilterOpen, setIsFilterOpen] = useState(false); // 필터링 창 열림/닫힘 상태
    const filterRef = useRef(null); // 필터 창 위치를 기준으로 설정하기 위한 ref

    // API에서 데이터 가져오기
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/problem/level');
                const data = await response.json();
                setProblemsByLevel(data);
                setFilteredProblems(data); // 기본적으로 모든 문제를 필터링 목록에 설정
            } catch (err) {
                console.error('Error fetching problems:', err);
            }
        };

        fetchProblems();
    }, []);

    // 레벨이나 유형에 따라 필터링
    useEffect(() => {
        filterProblems();
    }, [selectedLevel, selectedType, problemsByLevel]);

    // 문제 필터링 함수
    const filterProblems = () => {
        let filtered = problemsByLevel;

        if (selectedLevel) {
            filtered = filtered.filter((levelData) => levelData._id === parseInt(selectedLevel));
        }

        if (selectedType) {
            filtered = filtered.map((levelData) => ({
                ...levelData,
                problems: levelData.problems.filter((problem) => problem.type === selectedType),
            }));
            filtered = filtered.filter((levelData) => levelData.problems.length > 0);
        }

        setFilteredProblems(filtered);
    };

    // 필터 창 토글 함수
    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    // 필터 창 외부 클릭 시 닫힘 처리
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false); // 외부 클릭 시 필터 창 닫기
            }
        };

        if (isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // cleanup function to remove event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterOpen]);

    return (
        <div className="sidebar_container">
            <div className="problem-header">
                <h4>문제 목록</h4>
                <button className="filter-icon" onClick={toggleFilter}>
                    <FilterAltIcon />
                </button>
            </div>

            {/* 필터 창 */}
            {isFilterOpen && (
                <div ref={filterRef} className="filter-modal">
                    <div className="filter-header">
                        <button className="close-btn" onClick={toggleFilter}>
                            &times; {/* X 버튼 */}
                        </button>
                    </div>

                    <label htmlFor="level-select">레벨:</label>
                    <select id="level-select" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                        <option value="">모두</option>
                        <option value="1">레벨 1</option>
                        <option value="2">레벨 2</option>
                        <option value="3">레벨 3</option>
                    </select>

                    <label htmlFor="type-select">유형:</label>
                    <select id="type-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        <option value="">모두</option>
                        <option value="정렬">정렬</option>
                        <option value="탐색">탐색</option>
                        <option value="그래프">그래프</option>
                    </select>
                </div>
            )}

            {/* 필터링된 문제 목록 */}
            {filteredProblems.length === 0 ? (
                <p>문제를 불러오는 중...</p>
            ) : (
                filteredProblems.map((levelData) => (
                    <div key={levelData._id} className="level-section">
                        <h4>레벨 {levelData._id}</h4>
                        <ul>
                            {levelData.problems.map((problem) => (
                                <li key={problem._id}>
                                    <strong>{problem.title}</strong>
                                    <p>{problem.type}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default Sidebar;
