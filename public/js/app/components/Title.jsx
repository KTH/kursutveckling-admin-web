import React, { Component } from 'react'

class Title extends Component{
    render(){
        const { courseCode, header, title, language, image} = this.props
        return(
        <div key='course-title' id='course-title'>
             <h1>{header}</h1>
            <h4>
            <span>{courseCode}&nbsp;</span>
            { title 
            ?<span content={title.credits} datatype='xsd:decimal' property='teach:ects'> 
                {title.name}&nbsp;
                {language === 0 
                    ? title.credits 
                    : title.credits.toString().replace('.', ',')}&nbsp;{language === 0 ? 'credits' : 'hp'} 
            </span>
            : ''}
            </h4>
            <img src={image} className='progressImage' />
        </div>
        )
    }
}

export default Title