import React, { Component } from 'react'

class Title extends Component{
    render(){
        return(
        <div key='course-title' id='course-title'>
            <h1>
            <span>{this.props.courseCode}&nbsp;</span>
            {this.props.title 
            ?<span content={this.props.title.credits} datatype='xsd:decimal' property='teach:ects'> 
                {this.props.title.name}&nbsp;
                {this.props.language === 0 ? this.props.title.credits : this.props.title.credits.toString().replace('.', ',')}&nbsp;{this.props.language === 0 ? 'credits' : 'hp'} 
            </span>
            : ''}
            </h1>
        </div>
        )
    }
}

export default Title