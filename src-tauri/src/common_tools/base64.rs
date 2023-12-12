use crate::common_tools::base_response::BaseResponse;
use base64::{engine::general_purpose, Engine as _};
use image::io::Reader as ImageReader;
use image::{DynamicImage, ImageOutputFormat};
use std::any;
use std::io::Cursor;
use uuid::Uuid;

pub fn base64_encode_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let encoded: String = general_purpose::STANDARD.encode(source_string);
    Ok(encoded)
}
pub fn base64_decode_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let decode_vec = general_purpose::STANDARD.decode(source_string)?;
    let result = String::from_utf8_lossy(decode_vec.as_slice()).to_string();
    Ok(result)
}
pub fn base64_encode_of_image_with_error(
    source_image_path: String,
) -> Result<String, anyhow::Error> {
    let img = ImageReader::open(source_image_path)?.decode()?;
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let res_base64 = general_purpose::STANDARD.encode(image_data);
    // let result = format!("data:image/png;base64,{}", res_base64);
    Ok(res_base64)
}
pub fn base64_save_image_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let decode_vec = general_purpose::STANDARD.decode(source_string)?;
    let xx = ImageReader::new(Cursor::new(decode_vec))
        .with_guessed_format()?
        .decode()?;
    let dir = dirs::home_dir().ok_or(anyhow::Error::msg("获取用户目录失败"))?;

    let uuid = Uuid::new_v4().to_string();
    let random_name = format!("{}.png", uuid);
    let path = dir.join(random_name);

    let file_path = String::from(path.to_str().ok_or(anyhow!("获取文件路径失败"))?);
    xx.save(path)?;

    // let result = format!("data:image/png;base64,{}", res_base64);
    Ok(file_path)
}
