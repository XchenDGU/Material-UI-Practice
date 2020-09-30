import React from 'react';
import {makeStyles,} from '@material-ui/core';

//withStyle & makeStyles

const useStyles = makeStyles({
    sideMenu:{
        display:'flex',
        flexDirection:'column',
        position:'absolute',
        left:'0px',
        width:'320px',
        height:'100%',
        backgroundColor:'#253052',
    }
})

export default function SideMenu() {
    const classes = useStyles();

    return (
        <div className={classes.sideMenu}>
            
        </div>
    )
}


/*
const style = {
    sideMenu:{
        display:'flex',
        flexDirection:'column',
        position:'absolute',
        left:'0px',
        width:'320px',
        height:'100%',
        backgroundColor:'#253052',
    }
}

const SideMenu = (props) => {
    const {classes} = props; 

    return (
        <div className={classes.sideMenu}>
            
        </div>
    )
}

export default withStyles(style)(SideMenu); 
*/