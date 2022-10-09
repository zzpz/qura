
export class Loading extends React.Component{
    constructor(props){
        super(props)
        this.state = {loading:true}
    }

    componentDidMount(){
        
    }

    render(){
        if(!this.state.loading) {
            return <span></span>;
          }
          return <span className='fa-spinner fa-spin'></span>
    }
}