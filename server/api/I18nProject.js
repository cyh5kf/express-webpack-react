import { projectListModel } from '../Models/I18nProjectModel';

function formatJSON(data) {
    let resJSON = [];
    let item = {};
    data.forEach((val, index) => {
        item = {
            name: val.name,
            type: val.type,
            languages: val.languages
        }
        resJSON.push(item);
    })
    return resJSON;
}

//获取projectList数据
export const getProjectList = (req,res,next) => {
    projectListModel.find({},function(error,data){
        if(error) {
            return res.status(500).end('server error');
        } else {
            if(data) {
                
                const resJSON = formatJSON(data);
                return res.status(200).json(resJSON);
            } else {
                return res.status(200).json({});
            }
        }
        
    });
};

//添加新的项目数据
export const addProject = (req,res,next) => {   
    const reqData = req.body;
    const name = reqData.name;
    projectListModel.findOne({name: name}, (error,data)=> {
        if(error) {
            return res.status(500).end('server error');
        } else if(data) {
            return res.status(400).end('The project name can not be repeated');
        } else {
            projectListModel.create(reqData, (error,data)=>{
                if(error) {
                    return res.status(500).end('server error');
                } else {
                    return res.status(200).end('add project success!');
                }
                
            });
        }
    })

};

//更新项目数据
export const updateProject = (req,res,next) => {   
    const reqData = req.body;
    const name = reqData.name;
    const conditions = {name : name};
    const update = {$set : reqData};
    
    projectListModel.update(conditions, update, function(error){
        if(error) {
            return res.status(500).end('server error');
        } else {
            return res.status(200).end('Update success!');
        }
    });

};