pub fn get_about_version_with_error() -> Result<String, anyhow::Error> {
    const VERSION: &str = env!("CARGO_PKG_VERSION");
    Ok(String::from(VERSION))
}
