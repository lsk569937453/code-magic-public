use md5::{Digest, Md5};
use serde::Deserialize;
use serde::Serialize;
use sha2::Sha256;

use std::fs::File;
use std::io::Read;
const BUFFER_SIZE: usize = 1024;
#[derive(Serialize, Deserialize, Clone)]

pub struct FileDigest {
    pub file_name: String,
    pub text_md5: String,
    pub text_sha256: String,
}
#[derive(Serialize, Deserialize, Clone)]
pub struct DigestResponse {
    pub text_md5: Option<String>,
    pub text_sha256: Option<String>,

    pub file_md5_list: Option<Vec<FileDigest>>,
}
impl DigestResponse {
    pub fn new(
        text_md5: Option<String>,
        text_sha256: Option<String>,
        file_md5_list: Option<Vec<FileDigest>>,
    ) -> Self {
        Self {
            text_md5,
            text_sha256,
            file_md5_list,
        }
    }
}
pub fn digest_with_error(source_string: String) -> Result<(String, String), anyhow::Error> {
    let mut md5_hasher = Md5::new();
    let mut sha256_hasher = Sha256::new();
    md5_hasher.update(source_string.clone());
    sha256_hasher.update(source_string.clone());
    let md5_result = md5_hasher.finalize();
    let sha256_result = sha256_hasher.finalize();
    let md5_res = format!("{:x}", md5_result);
    let sha256_res = format!("{:x}", sha256_result);
    Ok((md5_res, sha256_res))
}

pub fn digest_of_file_with_error(
    source_file_path: String,
) -> Result<(String, String), anyhow::Error> {
    let mut file = File::open(source_file_path)?;
    let mut buffer = [0_u8; BUFFER_SIZE];
    let mut md5_hasher = Md5::new();
    let mut sha256_hasher = Sha256::new();

    loop {
        let count = file.read(&mut buffer)?;
        if count == 0 {
            break;
        }
        md5_hasher = md5_hasher.chain_update(buffer);
        sha256_hasher = sha256_hasher.chain_update(buffer);
    }
    let result1 = md5_hasher.finalize();
    let result2 = sha256_hasher.finalize();

    let res1 = format!("{:x}", result1);
    let res2 = format!("{:x}", result2);

    Ok((res1, res2))
}

pub fn digest_all_with_error(
    source_string_option: Option<String>,
    file_list_option: Option<Vec<String>>,
) -> Result<DigestResponse, anyhow::Error> {
    let mut res = DigestResponse::new(None, None, None);
    if let (None, None) = (source_string_option.clone(), file_list_option.clone()) {
        return Err(anyhow!(
            "source string and file list cannot be empty at the same time"
        ));
    }

    if let Some(source_string) = source_string_option {
        let (md5_res, sha256_res) = digest_with_error(source_string)?;
        res.text_md5 = Some(md5_res);
        res.text_sha256 = Some(sha256_res);
    }
    if let Some(file_list) = file_list_option {
        let mut file_md5_list = Vec::new();
        for file_path in file_list {
            let (md5_res, sha256_res) = digest_of_file_with_error(file_path.clone())?;
            let file_md5 = FileDigest {
                file_name: file_path.clone(),
                text_md5: md5_res,
                text_sha256: sha256_res,
            };
            file_md5_list.push(file_md5);
        }
        res.file_md5_list = Some(file_md5_list);
    }
    Ok(res)
}
