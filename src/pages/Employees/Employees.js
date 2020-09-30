import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm';
import PageHeader from '../../components/PageHeader';
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import Paper from '@material-ui/core/Paper';
import { makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import useTable from '../../components/useTable';
import * as employeeService from '../../services/employeeService';

import Controls from '../../components/controls/Controls';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';

import Notification from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';


const useStyles = makeStyles(theme=>({
    pageContent:{
        margin:theme.spacing(5),
        padding:theme.spacing(3),
    },
    searchInput:{
        width:'75%'
    },
    newButton:{
        position:'absolute',
        right:'10px',
    }
}));

const headCells=[
    {id:'fullName',label:'Employee Name'},
    {id:'email',label:'Email Address (Personal)'},
    {id:'mobile',label:'Mobile Number'},
    {id:'department',label:'Department'},
    {id:'actions',label:'Actions',disableSorting:true},

]

export default function Employees() {
    const classes = useStyles();
    const [records,setRecords] = useState(employeeService.getAllEmployees());
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}}); //can store function
    const [openPopup,setOpenPopup] = useState(false);

    const [recordForEdit,setRecordForEdit] = useState(null);

    const [notify,setNotify] = useState({isOpen:false,message:'',type:''});

    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subTitle:''});

    const handleSearch = e=>{
        let target = e.target;
        setFilterFn({
            fn:items=>{
                if(target.value==="")
                    return items;
                else
                    //return items that include the target value.
                    return items.filter(x=>x.fullName.toLowerCase().includes(target.value));
            }
        })
    }


    const{
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(records,headCells,filterFn);

    const addOrEdit = (employee,resetForm)=>{
        if(employee.id === 0)
            employeeService.insertEmployee(employee);
        else
            employeeService.updateEmployee(employee);
        resetForm();
        setRecordForEdit(null);
        setOpenPopup(false);
        setRecords(employeeService.getAllEmployees());
        setNotify({
            isOpen:true,
            message:"Submitted Successfully",
            type:'success',
        });
    }

    const openInPopup = item=>{
        setRecordForEdit(item);
        setOpenPopup(true);
    }
    const onDelete = id =>{
        setConfirmDialog({
            ...confirmDialog,
            isOpen:false
        })
        employeeService.deleteEmployee(id);
        setRecords(employeeService.getAllEmployees());
        setNotify({
            isOpen:true,
            message:"Deleted Successfully",
            type:'error',
        });
        
    };

    return (
        <>
            <PageHeader
            title ="New Employee"
            subTitle ="Form design with validation"
            icon = {<PeopleOutlineTwoToneIcon fontSize="large"/>}
            />
            <Paper className = {classes.pageContent}>
                
                <Toolbar>
                    <Controls.Input
                        label="Search Employees"
                        className = {classes.searchInput}
                        InputProps={{
                            startAdornment:(<InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>)
                        }}
                        onChange={ handleSearch }
                    />
                    <Controls.Button
                        text="Add New"
                        variant = "outlined"
                        startIcon = {<AddIcon/>}
                        className = {classes.newButton}
                        onClick = {()=>{setRecordForEdit(null); setOpenPopup(true)}}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead/>
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item=>
                                (<TableRow key={item.id}>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.mobile}</TableCell>
                                    <TableCell>{item.department}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                        color="primary"
                                        onClick={()=>(openInPopup(item))}>
                                            <EditOutlinedIcon fontSize="small"/>
                                        </Controls.ActionButton>
                                        <Controls.ActionButton
                                        color="secondary"
                                        onClick={()=>{
                                            setConfirmDialog({
                                                isOpen:true,
                                                title:'Are you sure to delete this record',
                                                subTitle:"You can't undo this operation",
                                                onConfirm:()=>{onDelete(item.id);}
                                            })
                                            
                                        }}>
                                            <CloseIcon fontSize="small"/>
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Controls.Popup
                title = "Employee Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                    <EmployeeForm
                        recordForEdit = {recordForEdit}
                        addOrEdit={addOrEdit}
                    />
            </Controls.Popup>
            <Notification
                notify = {notify}
                setNotify = {setNotify}
            />
            <ConfirmDialog
                confirmDialog = {confirmDialog}
                setConfirmDialog = {setConfirmDialog}
            />
        </>
    );
}
