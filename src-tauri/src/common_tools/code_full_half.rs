//全角转半角
pub fn to_cdb_with_error(str: String) -> Result<String, anyhow::Error> {
    let mut tmp = String::new();
    for ch in str.chars() {
        let unicode = ch as u32;
        if unicode > 65248 && unicode < 65375 {
            tmp.push(std::char::from_u32(unicode - 65248).ok_or(anyhow::anyhow!(""))?);
        } else {
            tmp.push(ch);
        }
    }
    Ok(tmp)
}
//半角转全角
pub fn to_dbc_with_error(txtstring: String) -> Result<String, anyhow::Error> {
    let mut tmp = String::new();
    for c in txtstring.chars() {
        match c {
            ' ' => tmp.push(char::from_u32(12288).ok_or(anyhow!(""))?),
            _ if c.is_ascii() => {
                let ch = c as u32;
                tmp.push(char::from_u32(ch + 65248).ok_or(anyhow!(""))?);
            }
            _ => {}
        }
    }
    Ok(tmp)
}
