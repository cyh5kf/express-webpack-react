import { I18nItemModel } from '../Models/I18nItemModel';
import XLSX from 'xlsx';

//查询I18nItem数据
export const queryItem = (req,res,next) => {
    const {limitStart, limitSize, searchType} = req.body;
    const queryConditons = {};
    if (searchType) { 
        const searchTypeKey = searchType;
        const searchTypeValue = req.body[searchTypeKey];
        
        if(searchTypeKey === 'projects') {
            queryConditons.projects = new RegExp(searchTypeValue);
        } else {
            queryConditons[searchTypeKey] = searchTypeValue;
        }
    }
    
    I18nItemModel.paginate(queryConditons, { page: limitStart, limit: limitSize }, function(err, result) {
        if(err) {
            return res.status(500).end('server error');
        } else {
            const {docs, total} = result;
            const queryResult = {
                data: docs,
                total: total
            }
            return res.status(200).json(queryResult);
        }
    });
    
};

//添加一条I18nItem数据
export const addItem = (req,res,next) => {
    const {source_key, projects, selectLanguage} = req.body;
    const value_key = `value_${selectLanguage}`;
    const value_data = req.body[value_key];
    const item_data = {
        source_key: source_key,
        projects: projects
    }
    item_data[value_key] = value_data;

    I18nItemModel.findOne({source_key: source_key}, (error,data)=> {
        if(error) {
            return res.status(500).end('server error');
        } else if(data) {
            const conditions = {source_key : source_key};
            I18nItemModel.update(conditions, item_data, function(error){
                if(error) {
                    return res.status(500).end('server error');
                } else {
                    return res.status(200).end('Update success!');
                }
            });
        } else {
            I18nItemModel.create(item_data, (error,data)=>{
                if(error) {
                    return res.status(500).end('server error');
                } else {
                    return res.status(200).end('add I18nItem success!');
                }
                
            });
        }
    })

};


//更新编辑I18nItem数据
export const updateItemById = (req,res,next) => {
    const {source_key, projects, selectLanguage} = req.body;
    const value_key = `value_${selectLanguage}`;
    const value_data = req.body[value_key];
    const item_data = {
        source_key: source_key,
        projects: projects
    }
    item_data[value_key] = value_data;
    const conditions = {source_key : source_key};
    I18nItemModel.update(conditions, item_data, function(error){
        if(error) {
            return res.status(500).end('server error');
        } else {
            return res.status(200).end('Update success!');
        }
    });

};

//删除一条I18nItem数据
export const deleteItem = (req,res,next) => {
    const {source_key} = req.body;
    const conditions = {source_key : source_key};
    
    I18nItemModel.remove(conditions, function(error){
        if(error) {
            return res.status(500).end('server error');
        } else {
            return res.status(200).end('Delete success!');
        }
    });

};


//导入excel文件
export const batchImportUploadByExcel = (req,res,next) => {
    console.log(`body: ${req.body}`);
    debugger
    // const workbook = XLSX.readFile('someExcel.xlsx');
    // const {source_key, projects, selectLanguage} = req.body;
    // const value_key = `value_${selectLanguage}`;
    // const value_data = req.body[value_key];
    // const item_data = {
    //     source_key: source_key,
    //     projects: projects
    // }
    // item_data[value_key] = value_data;
    // const conditions = {source_key : source_key};
    // I18nItemModel.update(conditions, item_data, function(error){
    //     if(error) {
    //         return res.status(500).end('server error');
    //     } else {
    //         return res.status(200).end('Update success!');
    //     }
    // });

};