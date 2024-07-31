
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <nav className={`navbar bg-gray-800 t-0 ml-0 px-4 py-12 h-auto relative flex flex-col justify-start ${isExpanded? 'w-[15%]': 'w-[8%]'}`}>
            <button className="navbar-toggle text-4xl text-white" onClick={toggleNavbar}>
                {/* {{isExpanded? 'X': '☰'}} */}☰
            </button>
            <div className={` mt-6 text-white text-lg font-bold sm:text-2xl ${isExpanded? '': 'hidden'}`}>
                <Link to="/">LOGO</Link>
            </div>
            <ul className={`mt-4 text-white text-sm sm:text-lg text-start ${isExpanded? '': 'hidden'}`}>
                <li className="mt-4">
                    <Link to='/general'>General</Link>
                </li>
                <li className="mt-4">
                    <Link to='/dash'>Dashboard</Link>
                </li>
                <li className="mt-4">
                    <Link to='/config'>Config</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
