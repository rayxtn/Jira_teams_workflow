export default function ConvertToBase64(file){
    return new Promise((resolve,reject)=>{
    const fileReader= new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = ()=>{
        return resolve(fileReader.result);
    }
    fileReader.onerror = (error)=>{
        reject(error);
    }
    })
}