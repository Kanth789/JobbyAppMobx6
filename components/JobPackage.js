import React from "react"
const JobPackage = (props)=>{
    const{jobSalary,onCheckedRadioApp} = props
    const {name,categoryId} = jobSalary

    const onChecked = ()=>{
        onCheckedRadioApp(categoryId)
    }
   const renderJobPackages = () =>{
        return(
            <div className="Employee-Type">
            <div className="type1">
            <input type="radio" id="employeeType1" name="employee" value={name} onClick={onChecked}></input>
             <label for="employee">{name}</label>
            </div>
        </div>
        
        )
    }
    
    return(
        <>
       
       {renderJobPackages()}
       </>
        
       
    )
}
export default JobPackage