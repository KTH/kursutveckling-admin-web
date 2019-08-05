import React, { Component } from 'react'
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap'

class CopyText extends Component {
    constructor(props){
        super(props)
        this.handleCopy = this.handleCopy.bind(this)
    }

    handleCopy(event){
        var textField = document.createElement('textarea')
        textField.innerText = this.props.textToCopy
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }
    
    render(){
        return(
            <InputGroup>
                <Input type ="text" value = {this.props.textToCopy} readOnly={true} />
                <InputGroupAddon addonType="append">
                    <Button color="secondary" className = 'copy-btn' onClick={this.handleCopy}>
                        <span className='icon-copy'></span>
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        )
    }
}

export default CopyText