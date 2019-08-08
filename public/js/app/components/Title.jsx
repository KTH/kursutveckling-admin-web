import React, { Component } from 'react'
import ProgressBar from '../components/ProgressBar'

class Title extends Component{
    render(){
        const { courseCode, header, title, language, progress, showProgressBar} = this.props
        title.credits = title.credits.toString().indexOf('.') < 0 ? title.credits + '.0' : title.credits
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
            {showProgressBar
                ? <ProgressBar language={language} active = {progress}/>
                : ''
            }
        </div>
        )
    }
}

export default Title