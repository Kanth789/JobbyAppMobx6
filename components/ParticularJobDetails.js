import { Component } from "react";
import {Link} from 'react-router-dom';
import Cookies from'js-cookie';
import Header from "./Header";
import { TailSpin } from 'react-loader-spinner';
import SimilarJob from "./SimilarJob";
import Skills from "./Skills";
import './Particular.css';
import { BiLinkExternal } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { ImLocation } from "react-icons/im";
import { MdWork } from "react-icons/md";
import NewWindow from 'react-new-window'
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }
class ParticularJobDeatils extends Component{
    state = {
          JobDetails:{},
          similarJobDetails:[],
          skillsData :[],
          apiStatus: apiStatusConstants.initial,
          lifeAtCompnay : []
    }
    componentDidMount(){
        const { match } = this.props
        const { params } = match
        const { id } = params
        this.getParticularJob(id)
    }
    getFormattedData = data => ({
        company_logo_url:data.company_logo_url,
        id:data.id,
        company_website_url:data.company_website_url,
        employment_type:data.employment_type,
        job_description:data.job_description,
        location:data.location,
        package_per_annum:data.package_per_annum,
        rating:data.rating,
        title:data.title
      })
      getLifeatCompany = data => ({
       
       description:data.description,
       image_url:data.image_url
      })
      
    getParticularJob = async(id) =>{
        
        const apiUrl = `https://apis.ccbp.in/jobs/${id}`
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method:"GET",
            headers:{
                Authorization : `Bearer ${jwtToken}`,
            },
        }
        const response = await fetch(apiUrl,options)
        console.log(response)
        if(response.ok === true)
        {
            const data = await response.json()
            console.log(data)
            const updatedFullJobs =this.getFormattedData(data.job_details)
            const updatedsimilarJobDetails = data.similar_jobs.map(eachItem=>({
                    company_logo_url:eachItem.company_logo_url,
                    id:eachItem.id,
                    job_description:eachItem.job_description,
                    location:eachItem.location,
                    package_per_annum:eachItem.package_per_annum,
                    rating:eachItem.rating,
                    title:eachItem.title
            }))
            const UpdatedskillsData = data.job_details.skills.map(
                eachItem => ({
                    image_url :eachItem.image_url,
                    name:eachItem.name
                })
              )
              const UpadtedlifeAtCompnay = this.getLifeatCompany(data.job_details.life_at_company)

            this.setState({lifeAtCompnay:UpadtedlifeAtCompnay,JobDetails:updatedFullJobs,skillsData:UpdatedskillsData,similarJobDetails:updatedsimilarJobDetails,apiStatus:apiStatusConstants.success})
           
        }
        else {
          this.setState({
            apiStatus: apiStatusConstants.failure,
          })
        }
    }
    OnclickedSimilar = (id) =>{
        this.getParticularJob(id)
        
    }
    renderFullJobDetails = () =>{
        const{JobDetails,apiStatus,skillsData,similarJobDetails,lifeAtCompnay} = this.state
        const{company_website_url,company_logo_url,id,employment_type,job_description,location,package_per_annum,rating,title} = JobDetails
        return(
            <>
            <Header/>
            <div className="job-similar">
            <div className="Job-Details">
                <div className="card">
            <div className="card-img-header">
                <div className="card-img">
                    <img src={company_logo_url}/>
                </div>
                <div className="card-header">
                    <h4>{title}</h4>
                    <div className="card-header-rating">
                    <AiFillStar color="gold"   size="17px"/>
                        <p>{rating}</p>
                    </div>
                </div>
            </div>
            <div className="card-icons">
                <div className="card-location-work">
                <div className="location">
                <ImLocation color="white"   size="17px"/>
                    <p>{location}</p>
                </div>
                <div className="work">
                <MdWork color="white"   size="17px"/>
                    <p>{employment_type}</p>
                </div>
                </div>
                <div className="card-salary">
                   <p>{package_per_annum}</p>
                </div>
            </div>
            <hr></hr>
            <div className="descripition-div">
            <h4>Description</h4>
            
            <div className="visit-link">
             
            <p>Visit</p>
            < BiLinkExternal onClick={() => window.open(company_website_url,"_self")} />
            </div>
            
            
            </div>
            <p>{job_description}</p>
            <div className="skill-conatiner">
                <h3>Skills</h3>
                <div className="skills-cards">
                {skillsData.map(eachItem=>(<Skills skills={eachItem}/>))}
                </div>
            </div>
            <div className="life-at-compny">
                <h3>Life at Company</h3>
                <div className="life-at-company-desc">
                <p>{lifeAtCompnay.description}</p>
                <img src={lifeAtCompnay.image_url}/>
                </div>
            </div>
        </div>
            </div>
            <div className="similar-jobs-conatiner">
                <h3>Similar Jobs</h3>
                <div className="similar-job-cards">
                {similarJobDetails.map(eachItem=>(<SimilarJob similarData={eachItem} key={eachItem.id} OnclickedSimilar={this.OnclickedSimilar}/>))}
                </div>
            </div>
            </div>
            </>
        )
    }
    render()
    {
        return(
            
        <>
        {this.renderFullJobDetails()}
        </>
        )
    }
}

export default ParticularJobDeatils