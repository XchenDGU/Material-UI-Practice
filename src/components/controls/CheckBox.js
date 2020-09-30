import React from 'react'
import { FormControlLabel, Checkbox as MuiCheckbox, FormControl } from '@material-ui/core'

export default function CheckBox(props) {
    const {name,label,value,onChange} = props;

    const convertToDefEventPara = (name,value)=>({
        target:{
            name,value
        }
    })

    return (
        <FormControl>
            <FormControlLabel
                control = {<MuiCheckbox
                            color="primary"
                            checked={value}
                            name={name}
                            onChange={e=>onChange(convertToDefEventPara(name,e.target.checked))}
                            />}
                label = {label}
            />
        </FormControl>
        
    )
}
