import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';
import {useForm,Form} from '../../components/useForm';

import Controls from '../../components/controls/Controls';

import * as employeeService from '../../services/employeeService';

const genderItems=[
    {id:'male',title:'Male'},
    {id:'female',title:'Female'},
    {id:'other',title:'Other'},
];


const initialFValues = {
    id:0,
    fullName:'',
    email:'',
    mobile:'',
    city:'',
    gender:'male',
    departmentId:'',
    hireDate:new Date(),
    isPermanent:false,
}


export default function EmployeeForm(props) {
    /*
    const [x,setX] = useState(5); //define component state object 
    //setX(6) to update x

    //will be executed when value of x changes
    useEffect(()=>{
        //callback fun
    },[x]); 
    */

    const {addOrEdit,recordForEdit}  = props;

    const validate=(fieldValues = values)=>{
        let temp = {...errors}; //store validation error msg

        if('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ?"":"This field is required.";
        if('email' in fieldValues)
            //email can be empty or must match the format.
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ?"":"Email is not valid.";
        if('mobile' in fieldValues)
            temp.mobile = fieldValues.mobile.length > 9 ?"":"Minimum 10 numbers required.";
        if('departmentId' in fieldValues)
            temp.departmentId = fieldValues.departmentId.length !==0 ?"":"This field is required";
        //set the errors
        setErrors({
            ...temp
        });

        if (fieldValues === values)
            //If every elements in temp is "", then there is no error.
            return Object.values(temp).every(x=>x==="");

    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues,true,validate);

    const handleSubmit=e=>{
        e.preventDefault(); //stops the default action of an element from happening
        if(validate()){
            addOrEdit(values,resetForm);
        }
    };

    //invoke whenever there is change to input value (recordForEdit)
    useEffect(() => {
        if(recordForEdit != null)
            setValues({
                ...recordForEdit
            });
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
        <Grid container>
            <Grid item xs={6}>
                <Controls.Input 
                name="fullName"
                label="FULL Name"
                value={values.fullName}
                onChange={handleInputChange}
                error={errors.fullName} //using the error msg set by validate(),called in handleSubmit

                />

                <Controls.Input 
                label="Email" 
                name="email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
                />

                <Controls.Input 
                label="Mobile" 
                name="mobile"
                value={values.mobile}
                onChange={handleInputChange}
                error={errors.mobile}
                />

                <Controls.Input 
                label="City" 
                name="city"
                value={values.city}
                onChange={handleInputChange}
                />

            </Grid>
            <Grid item xs={6}>
                <Controls.RadioGroup
                    name="gender"
                    label="Gender"
                    value={values.gender} 
                    onChange={handleInputChange}
                    items={genderItems}
                />
                <Controls.Select
                    name="departmentId"
                    label="Department"
                    value={values.departmentId}
                    onChange={handleInputChange}
                    options = {employeeService.getDepartmentCollection()}
                    error = {errors.departmentId}
                />
                <Controls.DatePicker
                    name="hireDate"
                    label="Hire Date"
                    value = {values.hireDate}
                    onChange = {handleInputChange}
                />

                <Controls.CheckBox
                    name="isPermanent"
                    label="Permanent Employee"
                    value = {values.isPermanent}
                    onChange = {handleInputChange}
                />
                <div>
                    <Controls.Button
                        type="submit"
                        text="Submit"
                    />
                    <Controls.Button
                        text="Reset"
                        color="default"
                        onClick={resetForm}
                    />
                </div>
            </Grid>
        </Grid>
        </Form>
        
    )
}
