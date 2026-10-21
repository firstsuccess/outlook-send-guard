import{spawnSync}from'node:child_process';
for(const file of ['manifest-admin.xml','manifest-user.xml']){
 console.log(`Validating ${file}`);
 const result=spawnSync(process.execPath,['node_modules/office-addin-manifest/cli.js','validate',file],{stdio:'inherit'});
 if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);
}
