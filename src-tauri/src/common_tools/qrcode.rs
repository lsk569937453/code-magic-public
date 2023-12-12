use base64::{engine::general_purpose, Engine as _};
use qrcode_generator::QrCodeEcc;

use barcoders::generators::image::*;
use barcoders::sym::code39::*;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufWriter;
use std::io::Write;
use std::path::Path;
use uuid::Uuid;
pub fn get_qrcode_with_error(text: String) -> Result<String, anyhow::Error> {
    // Encode some data into bits.
    let result: String =
        qrcode_generator::to_svg_to_string(text, QrCodeEcc::Low, 2048, None::<&str>)?;
    let encoded: String = general_purpose::STANDARD.encode(result);

    Ok(encoded)
}
pub fn export_qrcode_with_error(text: String) -> Result<String, anyhow::Error> {
    let dir = dirs::home_dir().ok_or(anyhow::Error::msg("获取用户目录失败"))?;

    let uuid = Uuid::new_v4().to_string();
    let random_name = format!("{}.png", uuid);
    let path = dir.join(random_name);
    qrcode_generator::to_png_to_file(text, QrCodeEcc::Low, 1024, path.clone())?;

    let file_path = String::from(path.to_str().ok_or(anyhow!("获取文件路径失败"))?);
    Ok(file_path)
}
pub fn get_barcode_with_error(text: String) -> Result<String, anyhow::Error> {
    let barcode = Code39::new(text)?;
    let png = Image::PNG {
        height: 1024,
        xdim: 10,
        rotation: Rotation::Zero,
        // Using non black/white colors is generally not recommended by most vendors, but barcoders makes it possible.
        foreground: Color::new([255, 255, 255, 255]),
        background: Color::new([0, 0, 0, 255]),
    }; // You must specify the height in pixels.
    let encoded = barcode.encode();
    let result = png.generate(&encoded[..])?;
    let encoded: String = general_purpose::STANDARD.encode(result);

    Ok(encoded)
}
pub fn export_barcode_with_error(text: String) -> Result<String, anyhow::Error> {
    let dir = dirs::home_dir().ok_or(anyhow::Error::msg("获取用户目录失败"))?;

    let uuid = Uuid::new_v4().to_string();
    let random_name = format!("{}.png", uuid);
    let path = dir.join(random_name);
    let barcode = Code39::new(text)?;
    let png = Image::PNG {
        height: 1024,
        xdim: 10,
        rotation: Rotation::Zero,
        // Using non black/white colors is generally not recommended by most vendors, but barcoders makes it possible.
        foreground: Color::new([255, 255, 255, 255]),
        background: Color::new([0, 0, 0, 255]),
    };

    let encoded = barcode.encode();

    let bytes = png.generate(&encoded[..])?;

    // Which you can then save to disk.
    let file = File::create(&path)?;
    let mut writer = BufWriter::new(file);
    let _ = writer.write(&bytes[..])?;

    let file_path = String::from(path.to_str().ok_or(anyhow!("获取文件路径失败"))?);
    Ok(file_path)
}
