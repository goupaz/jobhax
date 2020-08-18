//
//  JHButton.swift
//  JobHax
//
//  Created by Yinan Qiu on 8/18/20.
//  Copyright © 2020 Yinan. All rights reserved.
//

import UIKit

class JHButton: UIButton {

    override init(frame: CGRect) {
        super.init(frame: frame)
        configure()
    }
    
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
    
    private func configure() {
        translatesAutoresizingMaskIntoConstraints = false
        heightAnchor.constraint(equalToConstant: 80).isActive = true
        layer.cornerRadius = 40
        backgroundColor = .systemIndigo
    }
    
}
