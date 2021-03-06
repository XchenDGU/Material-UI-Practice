import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, makeStyles, TablePagination, TableSortLabel } from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    table:{
        marginTop:theme.spacing(3),
        '& thead th':{
            fontWeight:'600',
            color:theme.palette.primary.main,
            backgroundColor:theme.palette.primary.light,
        },
        '& tbody td':{
            fontWeight:'300',
        },
        '& tbody tr:hover':{
            backgroundColor:'#fffbf2',
            cursor:'pointer',
        }
    }
}))


export default function useTable(records,headCells,filterFn) {
    const classes = useStyles();

    const pages = [5,10,25];
    const [page,setPage] = useState(0);
    const [rowsPerPage,setRowsPerPage] = useState(pages[page]);
    const [order,setOrder] = useState();
    const [orderBy,setOrderBy] = useState();


    const TblContainer = props =>(
        <Table className={classes.table}>
            {props.children}
        </Table>
    );
    
    const TblHead = props=>{
        const handleSortRequest = cellId=>{
            const isAsc = (orderBy ===cellId && order==="asc");
            setOrder(isAsc?'desc':'asc');
            setOrderBy(cellId);
        }

        return (<TableHead>
            <TableRow>
            {
                headCells.map(headCell => (
                    <TableCell key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}>
                        {headCell.disableSorting ? headCell.label :
                            <TableSortLabel
                            active = {orderBy === headCell.id}
                            onClick = {()=>{handleSortRequest(headCell.id)}}
                            direction = {orderBy === headCell.id ? order:'asc'}>
                                {headCell.label}
                            </TableSortLabel>
                        }
                    </TableCell>))
            }
            </TableRow>
        </TableHead>)
    };


    const handleChangePage = (event,newPage)=>{
        setPage(newPage);
    };
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value,10));
        setPage(0);
    }

    const TblPagination = ()=>(<TablePagination
        component = "div"
        page = {page}
        rowsPerPageOptions = {pages}
        rowsPerPage = {rowsPerPage}
        count = {records.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
    />)

    function descendingComparator(a,b,orderBy){
        //sort it based on orderBy(id in the object list,ex:name,department, etc)
        if(b[orderBy] < a[orderBy]){
            return -1;
        }
        if(b[orderBy] > a[orderBy]){
            return 1;
        }
        return 0;
    }

    function getComparator(order,orderBy){
        return order === 'desc'
        ? (a,b) => descendingComparator(a,b,orderBy) //desc
        : (a,b) => -descendingComparator(a,b,orderBy) //asc
    }

    function stableSort(array,comparator){
        //map into tuples(element,index)
        const stabilizedThis = array.map((el,index)=>[el,index]);
        stabilizedThis.sort((a,b)=>{
            const order = comparator(a[0],b[0]); //get -1(switch),0(same),1(in order)
            if (order !==0) return order; //not equal
            
            return a[1] - b[1] //equal, then use the index to determine the order
        });
        return stabilizedThis.map((el)=>el[0]); //remove the index

    };
    
    const recordsAfterPagingAndSorting = () =>{
        //filter the records before sorting
        return stableSort(filterFn.fn(records),getComparator(order,orderBy))
            .slice(page*rowsPerPage,(page+1)*rowsPerPage);
        
    }

    return {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    }
}
