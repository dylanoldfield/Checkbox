import React from 'react';
import {ReactComponent as DownSVG} from '../assets/caret-down.svg'
import {ReactComponent as UpSVG} from '../assets/caret-up.svg'
import {ReactComponent as SortArrows} from '../assets/sort-arrows.svg'
import { SortDirection } from '../interfaces/Tasks';

type Props = {
    title: string;
    fieldName: string;
    sortHeader: boolean;
    sortedCol: {
        column: string;
        dir: SortDirection;
    };
    handleClick: React.Dispatch<React.SetStateAction<{
        column: string;
        dir: SortDirection;
    }>>
  };

function TaskHeader(props:Props) {

    const sortClicked = (e:React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        // checks if this a new column to be sorted otherwise iterates through sort directions
        if(props.sortedCol.column !== props.fieldName){
            props.handleClick({column:props.fieldName, dir:SortDirection.Asc})
        }else{
            const sortD = props.sortedCol.dir  === SortDirection.None ? SortDirection.Asc : props.sortedCol.dir === SortDirection.Asc ? SortDirection.Dsc : SortDirection.None
            props.handleClick({column:props.fieldName, dir:sortD})
        }
    }


    return (
        <th scope="col" className='py-3 px-6'>
        <div className="flex items-center">
        <>
        {props.title}
        {props.sortHeader? 
            <button onClick={sortClicked}>
                {props.sortedCol.column !== props.fieldName ? 
                    <SortArrows className="ml-1 w-3 h-2.5"/> :
                    <>
                    {props.sortedCol.dir === SortDirection.None ? <SortArrows className="ml-1 w-3 h-2.5"/> : <></>}
                    {props.sortedCol.dir === SortDirection.Asc ? <UpSVG className="ml-1 w-3 h-2"/> : <></>}    
                    {props.sortedCol.dir === SortDirection.Dsc ? <DownSVG className="ml-1 w-3 h-2"/> : <></>} 
                    </>
            }
            </button>:<></>}
        </>
        </div>
        </th>
    );
  }
  
  export default TaskHeader;
  