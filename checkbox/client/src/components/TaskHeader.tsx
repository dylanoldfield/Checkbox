import React from 'react';
import { useState } from 'react';
import {ReactComponent as DownSVG} from '../assets/caret-down.svg'
import {ReactComponent as UpSVG} from '../assets/caret-up.svg'
import {ReactComponent as SortArrows} from '../assets/sort-arrows.svg'

export enum SortDirection{
        None = "none",
        Asc ="asc",
        Dsc = "dsc"
}


type Props = {
    title: string;
    sortHeader: boolean;
    click: (title: string, sortD: SortDirection) => void;
  };

function TaskHeader(props:Props) {
    const [sortD, setSortD] = useState(SortDirection.None)
    const [t] = useState(props.title)
    const [sortable] = useState(props.sortHeader)
    
    const sortClicked = (e:React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        sortD === SortDirection.Asc ? setSortD(SortDirection.Dsc) : sortD === SortDirection.Dsc ? setSortD(SortDirection.None) : setSortD(SortDirection.Asc)
        props.click(t, sortD)
    }


    return (
        <th scope="col" className='py-3 px-6'>
        <div className="flex items-center">
        <>
        {t}
        {sortable? 
            <a href="#" onClick={sortClicked}>
                <>
                {sortD === SortDirection.None ? <SortArrows className="ml-1 w-3 h-2.5"/> : <></>}
                {sortD === SortDirection.Asc ? <UpSVG className="ml-1 w-3 h-2"/> : <></>}    
                {sortD === SortDirection.Dsc ? <DownSVG className="ml-1 w-3 h-2"/> : <></>} 
                </>
            </a>:<></>}
        </>
        </div>
        </th>
    );
  }
  
  export default TaskHeader;
  