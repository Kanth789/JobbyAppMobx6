import { Component } from "react";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import { BallTriangle } from 'react-loader-spinner';
import './JobPage.css';
import Header from "./Header";
import Alljobs from "./Alljobs";
import FiltersGroup from "./FilersGroup";
import JobPackage from "./JobPackage";
import SearchBar from "./searchBar";
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }
  const apiStatusOfJobs = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }
   const JobTypes = [
    {
      name: 'Full Time',
      categoryId: 'FULLTIME',
      checked:false
    },
    {
      name: 'Part Time',
      categoryId: 'PARTTIME',
      checked:false
    },
    {
      name: 'Freelance',
      categoryId: 'FREELANCE',
      checked:false
    },
    {
      name: 'Internship',
      categoryId: 'INTERNSHIP',
      checked:false
    },
    
  ]
  const JobPackages = [
    {
      name: '10 LPA and above',
      categoryId: '1000000',
    },
    {
      name: '20 LPA and above',
      categoryId: '2000000',
    },
    {
      name: '30 LPA and above',
      categoryId: '3000000',
    },
    {
      name: '40 LPA and above',
      categoryId: '4000000',
    },
    
  ]
 let  updatedjob = [];
class JobPage extends Component{
    state ={
        profileData:[],
        jobsList :[],
        apiStatus: apiStatusConstants.initial,
        apiJobs:apiStatusOfJobs.initial,
        activeJobType:[],
        activeJobPackage:'',
        searchInput: '',
        

    }
   
    onCheckedApp = (categoryId,checked) =>{
       const{activeJobType,checkedBox} = this.state
        // this.setState(prevState=>({checkedBox:!prevState.checkedBox}))
        // if(checkedBox === true)
        // {
        //   updatedjob.push(categoryId)
        // }else{
        //   updatedjob.splice(categoryId,1)
        // }
        const CheckId = updatedjob.includes(categoryId)
        // const filterCheckId = (updatedjob) =>{
        //     return updatedjob !== categoryId
        // }
        // console.log(filterCheckId())
        if(!CheckId)
        {
          updatedjob.push(categoryId)
        }
        else{
          updatedjob=updatedjob.filter((item)=>item!==categoryId)
        }
        console.log(updatedjob)
        this.setState({activeJobType:updatedjob},this.getFullData)
        console.log(this.state.activeJobType)
    }
    onCheckedRadioApp = (categoryId) =>{
      this.setState({activeJobPackage:categoryId},this.getFullData)
    }
    enterSearchInput = () => {
      this.getFullData()
    }
    changeSearchInput = searchInput => {
      this.setState({searchInput})
    }
    componentDidMount(){
        this.getData()
        this.getFullData()
    }
    getFullData = async ()=>{
     
      this.setState({
        apiJobs: apiStatusOfJobs.inProgress,
      })
        const{jobsList,apiJobs,activeJobType,activeJobPackage,searchInput}  = this.state
       console.log(activeJobPackage)
        const apiUrl=`https://apis.ccbp.in/jobs?employment_type=${activeJobType.join()}&minimum_package=${activeJobPackage}&search=${searchInput}`
       const jwtToken = Cookies.get('jwt_token')
        const options = {
            method:"GET",
            headers:{
                Authorization : `Bearer ${jwtToken}`,
            },
        }
        try{
        const response =  await fetch(apiUrl,options)
       
        if(response.ok === true)
        {
            console.log(response)
            const data =  await response.json()
            
            const updatedFullJobs = data.jobs.map(eachItem=>({
                company_logo_url:eachItem.company_logo_url,
                id:eachItem.id,
                employment_type:eachItem.employment_type,
                job_description:eachItem.job_description,
                location:eachItem.location,
                package_per_annum:eachItem.package_per_annum,
                rating:eachItem.rating,
                title:eachItem.title
            }))
           this.setState({jobsList:updatedFullJobs,apiJobs:apiStatusOfJobs.success})
           
        }
      }
        catch  {
            this.setState({
              apiJobs: apiStatusOfJobs.failure,
            })
          }
    }
    
    getData = async ()=>{
       const{profileData,apiStatus}  = this.state
       const apiUrl="https://apis.ccbp.in/profile"
       const jwtToken = Cookies.get('jwt_token')
        const options = {
            method:"GET",
            headers:{
                Authorization : `Bearer ${jwtToken}`,
            },
        }
        try{
        const response = await fetch(apiUrl,options)
        if(response.ok === true)
        {
            const data =  await response.json()
            
            const UpdatedProfileData = data.profile_details
            
            this.setState({profileData:UpdatedProfileData, apiStatus: apiStatusConstants.success})
           
        }
      }
        catch {
            this.setState({
              apiStatus: apiStatusConstants.failure,
            })
          }
    }
    renderFullViewProfile = () =>{
        const {profileData,apiStatus} = this.state
        const{name,profile_image_url,short_bio} = profileData
        return(
            <div className="profile-job-conatiners">
           
            <div className="profile-job-details">
            <div className="profile-conatiner">
                <div className="logo">
                    <img src={profile_image_url}/>
                    <h3>{name}</h3>
                </div>
                <div className="profile-content">
                    <p>{short_bio}</p>
                </div>
            </div>
            
            
            <div className="jobs-conatiner">
              <SearchBar changeSearchInput={this.changeSearchInput} enterSearchInput={this.enterSearchInput}/>
            </div>
            </div>
            </div>
        )
    }
   
    lengthOfList=()=>{
      const{jobsList} = this.state
      console.log(jobsList)
      if(jobsList.length > 0 )
      {
          return this.renderFullJobsList()
      }
      else{
        return this.renderNoJobsFound() 
      }
    }
    renderNoJobsFound = ()=>{
      return(
        <div>
          <img src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"/>
        </div>
      )
    }
    renderFullJobsList = ()=>{
        const{jobsList,apiStatus}  = this.state
        return(
            <div> 
              {jobsList.map(eachItem=>(<Alljobs jobData={eachItem} key={eachItem.id}/>))}
              </div>
        )
    }
    renderLoadingView = () => (
        <div className="products-details-loader-container" testid="loader">
                    <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          />
        </div>
      )
      ClickedButton = ()=>{
        this.getData()
      }
      renderFailureView = () => (
        <div className="product-details-error-view-container">
            <button onClick ={this.ClickedButton} type="button" className="failure-button">
              Retry
            </button>
         
        </div>
      )
      renderJobFailureView = () => (
        <div className="job-failure-view">
          
          <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png "/>
          
            
         
        </div>
      )
      renderProfileDetails = () => {
        const {apiStatus} = this.state
    
        switch (apiStatus) {
          case apiStatusConstants.success:
            return this.renderFullViewProfile()
          case apiStatusConstants.failure:
            return this.renderFailureView()
          case apiStatusConstants.inProgress:
            return this.renderLoadingView()
          default:
            return null
        }
      }
      renderJobProfiles = () => {
        const {apiJobs} = this.state
        console.log(apiJobs)
        switch (apiJobs) {
          
          case apiStatusOfJobs.success:
          
            return this.lengthOfList()
          case apiStatusOfJobs.failure:
            
            return this.renderJobFailureView()
          case apiStatusOfJobs.inProgress:
            return this.renderLoadingView()
          default:
            return null
        }
      }
    render()
    {
      const{activeJobType,checkedBox} = this.state
        return(
            <>
             <Header/>
            <div className="filters-profile">
            {this.renderProfileDetails()} 
            <div className="filters-profile-conatiner">
            <div className="filters-conatiner">
              <hr></hr>
              <h2>Type of Employment</h2>
              {JobTypes.map(eachItem=>(<FiltersGroup jobsFilters={eachItem} key={eachItem.categoryId} onCheckedApp={this.onCheckedApp}  checkedBox={checkedBox}/> ))}
              <hr></hr>
              <h2>Salary Range</h2>
              {JobPackages.map(eachItem=>(<JobPackage jobSalary={eachItem} key={eachItem.categoryId} onCheckedRadioApp={this.onCheckedRadioApp}/>))}
            </div>
            <div className="profile-card"> 
             {this.renderJobProfiles()}
             </div>
            </div>
            </div>
            </>
        )
    }
}
export default JobPage