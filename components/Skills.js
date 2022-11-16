const Skills =(props)=>{
    const {skills} = props
    const{image_url,name} = skills
    return(

                <div className="skill-icons">
                    <div className="icon">
                        <img src={image_url}/>
                        <p>{name}</p>
                    </div>
                </div>
         
    )
}
export default Skills